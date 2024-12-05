package com.aspiraconnect.hf.ca

import android.app.Application
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.res.Configuration
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactContext
import com.facebook.react.config.ReactFeatureFlags
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import expo.modules.ApplicationLifecycleDispatcher.onApplicationCreate
import expo.modules.ApplicationLifecycleDispatcher.onConfigurationChanged
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost = ReactNativeHostWrapper(this, object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages: MutableList<ReactPackage> = PackageList(this).packages
            // Packages that cannot be autolinked yet can be added manually here, for example:
            packages.add(AppPackage())
            return packages
        }

        override fun getJSMainModuleName(): String {
            return ".expo/.virtual-metro-entry"
        }

        override val isNewArchEnabled: Boolean
            get() = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean
            get() = BuildConfig.IS_HERMES_ENABLED
    })

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    fun getReactContext(): ReactContext? {
        return reactNativeHost.reactInstanceManager?.currentReactContext
    }

    override fun registerReceiver(receiver: BroadcastReceiver?, filter: IntentFilter?): Intent? {
        if (Build.VERSION.SDK_INT >= 34 && applicationInfo.targetSdkVersion >= 34) {
            return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            return super.registerReceiver(receiver, filter)
        }
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this,  /* native exopackage */false)
        if (!BuildConfig.REACT_NATIVE_UNSTABLE_USE_RUNTIME_SCHEDULER_ALWAYS) {
            ReactFeatureFlags.unstable_useRuntimeSchedulerAlways = false
        }
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }
        ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
        onApplicationCreate(this)
        instance = this
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        onConfigurationChanged(this, newConfig)
    }

    companion object {
        lateinit var instance: MainApplication
    }

}