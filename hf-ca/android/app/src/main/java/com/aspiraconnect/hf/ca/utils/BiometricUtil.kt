package com.aspiraconnect.hf.ca.utils

import android.app.Activity
import android.content.Context.MODE_PRIVATE
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Log
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.aspiraconnect.hf.ca.MainApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import java.security.KeyStore
import java.util.concurrent.Executor
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey

private const val TAG = "BiometricUtil"

object BiometricUtil {
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo
    private lateinit var executor: Executor
    private const val keyName = "___key_ca____"
    private const val androidKeyStore = "AndroidKeyStore"
    private const val biometricChanged = "biometricChanged"
    private  val sharedPreferences = MainApplication.instance.getSharedPreferences("ca_biometric_info", MODE_PRIVATE)

    fun checkBiometricsChanged(): Boolean {
        var changed = sharedPreferences.getBoolean(biometricChanged, false)
        if (!changed) {
            if (getEncryptCipher(keyName) == null) {
                deleteKey(keyName)
                changed = true
            }
        }
        if (changed) {
            sharedPreferences.edit().putBoolean(biometricChanged, false).apply()
        }
        return changed
    }

    fun supportClass3Auth() : Boolean {
        BiometricManager.from(MainApplication.instance).run {
            val canAuthenticate = this.canAuthenticate(BIOMETRIC_STRONG)
            return canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS
        }
    }

    fun authenticateAsync(activity: Activity, promptMessage: String, cancelLabel: String, promise: Promise) {
        activity.runOnUiThread {
            BiometricManager.from(MainApplication.instance).run {
                val canAuthenticate = this.canAuthenticate(BIOMETRIC_STRONG)
                if (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS) {
                    promptInfo = BiometricPrompt.PromptInfo.Builder()
                        .setTitle(promptMessage)
                        .setAllowedAuthenticators(BIOMETRIC_STRONG)
                        .setNegativeButtonText(cancelLabel) // Set non-empty negative button text
                        .build()
                    executor = ContextCompat.getMainExecutor(MainApplication.instance)
                    biometricPrompt = BiometricPrompt(activity as FragmentActivity, executor,
                        object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationError(
                                errorCode: Int,
                                errString: CharSequence
                            ) {
                                super.onAuthenticationError(errorCode, errString)
                                Log.d(TAG, "onAuthenticationError: $errorCode,$errString")
                                promise.resolve(Arguments.createMap().apply {
                                    putBoolean("success", false)
                                    putString("error", convertErrorCode(errorCode))
                                    putString("warning", errString.toString())
                                })
                            }

                            override fun onAuthenticationSucceeded(
                                result: BiometricPrompt.AuthenticationResult
                            ) {
                                super.onAuthenticationSucceeded(result)
                                Log.d(TAG, "onAuthenticationSucceeded: $result")
                                promise.resolve(Arguments.createMap().apply {
                                    putBoolean("success", true)
                                })
                            }

                        })

                    var encryptCipher = getEncryptCipher(keyName)
                    if (encryptCipher == null) {
                        deleteKey(keyName)
                        encryptCipher = getEncryptCipher(keyName)
                        sharedPreferences.edit().putBoolean(biometricChanged, true).apply()
                    }
                    biometricPrompt.authenticate(
                        promptInfo, BiometricPrompt.CryptoObject(encryptCipher!!)
                    )
                } else {
                    promise.resolve(Arguments.createMap().apply {
                        this.putBoolean("success", false)
                        this.putString("error", "not_available")
                        this.putString("warning", "The user can't authenticate: $canAuthenticate")
                    })
                }
            }

        }

    }

    private fun getCipher(): Cipher {
        return Cipher.getInstance(
            KeyProperties.KEY_ALGORITHM_AES + "/"
                    + KeyProperties.BLOCK_MODE_CBC + "/"
                    + KeyProperties.ENCRYPTION_PADDING_PKCS7
        )
    }

    private fun getEncryptCipher(keyName: String): Cipher? {
        return try {
            val cipher = getCipher()
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(keyName))
            cipher
        } catch (e: Exception) {
            Log.e(TAG, e.toString())
            null
        }
    }

    private fun generateSecretKey(keyGenParameterSpec: KeyGenParameterSpec): SecretKey? {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES, androidKeyStore
        )
        keyGenerator.init(keyGenParameterSpec)
        return keyGenerator.generateKey()
    }

    private fun getSecretKey(keyName: String): SecretKey? {
        val keyStore = KeyStore.getInstance(androidKeyStore)

        // Before the keystore can be accessed, it must be loaded.
        keyStore.load(null)
        keyStore.getKey(keyName, null)?.let {
            return it as SecretKey
        }

        return generateSecretKey(
            KeyGenParameterSpec.Builder(
                keyName,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
                .setUserAuthenticationRequired(true)
                // Invalidate the keys if the user has registered a new biometric
                // credential, such as a new fingerprint. Can call this method only
                // on Android 7.0 (API level 24) or higher. The variable
                // "invalidatedByBiometricEnrollment" is true by default.
                .setInvalidatedByBiometricEnrollment(true)
                .build()
        )
    }

    private fun deleteKey(keyName: String) {
        try {
            val keyStore = KeyStore.getInstance(androidKeyStore)
            keyStore.load(null)
            keyStore.deleteEntry(keyName)
        } catch (e: Exception) {
           Log.e(TAG, e.toString())
        }
    }

    private fun convertErrorCode(code: Int): String {
        return when (code) {
            BiometricPrompt.ERROR_CANCELED, BiometricPrompt.ERROR_NEGATIVE_BUTTON, BiometricPrompt.ERROR_USER_CANCELED -> "user_cancel"
            BiometricPrompt.ERROR_HW_NOT_PRESENT, BiometricPrompt.ERROR_HW_UNAVAILABLE, BiometricPrompt.ERROR_NO_BIOMETRICS, BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL -> "not_available"
            BiometricPrompt.ERROR_LOCKOUT, BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "lockout"
            BiometricPrompt.ERROR_NO_SPACE -> "no_space"
            BiometricPrompt.ERROR_TIMEOUT -> "timeout"
            BiometricPrompt.ERROR_UNABLE_TO_PROCESS -> "unable_to_process"
            else -> "unknown"
        }
    }
}