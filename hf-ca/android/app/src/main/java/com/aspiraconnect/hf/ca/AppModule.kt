package com.aspiraconnect.hf.ca

import android.util.Log
import com.aspiraconnect.hf.ca.utils.BiometricUtil
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

private const val TAG = "AppModule"

class AppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "HFApp"

    @ReactMethod
    fun checkBiometricsChanged(promise: Promise) {
        promise.resolve(BiometricUtil.checkBiometricsChanged())
    }

    @ReactMethod
    fun showBiometricPrompt(map: ReadableMap, promise: Promise) {
        Log.d(TAG, map.toString())
        val promptMessage = map.getString("promptMessage") ?: "Access your account"
        val cancelLabel = map.getString("cancelLabel") ?: "Cancel"
        if (currentActivity == null) {
            promise.resolve(Arguments.createMap().apply {
                this.putBoolean("success", false)
                this.putString("error", "not_available")
                this.putString("warning", "getCurrentActivity() returned null")
            })
        } else {
            try {
                BiometricUtil.authenticateAsync(currentActivity!!, promptMessage, cancelLabel, promise)
            } catch (e: Exception) {
                promise.resolve(Arguments.createMap().apply {
                    this.putBoolean("success", false)
                    this.putString("error", "not_available")
                    this.putString("warning", "Unexpected error:$e")
                })
            }
        }
    }


}
