//
//  RNPushNotification.m
//  HuntFishKS
//
//  Created by Eric Hou on 2023/4/10.
//

#import "HFNativeModule.h"
#import <LocalAuthentication/LocalAuthentication.h>

@implementation HFNativeModule

RCT_EXPORT_MODULE(HFApp)


RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTestName)
{
  return @"ios test module";
}

RCT_EXPORT_METHOD(checkBiometricsChanged:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL changed = NO;

    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;

    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        
        [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthentication error:nil];
        NSData *domainState = [context evaluatedPolicyDomainState];
        
        // load the last domain state from touch id
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSData *oldDomainState = [defaults objectForKey:@"domainTouchID"];
        
        if (oldDomainState)
        {
            // check for domain state changes
            
            if ([oldDomainState isEqual:domainState])
            {
                NSLog(@"nothing changed.");
            }
            else
            {
                changed = YES;
                NSLog(@"domain state was changed!");
            }
        }

        // save the domain state that will be loaded next time
        [defaults setObject:domainState forKey:@"domainTouchID"];
        [defaults synchronize];
        
        resolve([NSNumber numberWithBool:changed]);
    } else {
        NSString *errorMessage = [NSString stringWithFormat:@"%@", error.description];
        reject(@"403", errorMessage, error);
    }
}


@end
