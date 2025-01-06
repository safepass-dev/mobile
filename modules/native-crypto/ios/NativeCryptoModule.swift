import ExpoModulesCore

public class NativeCryptoModule: Module {
    public func definition() -> ModuleDefinition {
        Name("NativeCrypto")

        Constants([
            "PI": Double.pi
        ])

        Events("onResult")

        Function("createMphAndPsk") { (password: String, email: String) -> Void in
            self.sendEvent("onResult", [
                "result" : ""
                // "result": "{\"masterPasswordHash\":\"MgS0Q2ruMsxbH71DBGbWHSTCl\/7\/Pg22G2ET0NxSuao=\",\"protectedSymmetricKey\":\"rAZ2NvXf1VbM8U6UTTa1BQrDZ2LFPI\/NRn1kMuAHRes=:2lK4Iwt1Bdk5trUrhbLKF6wGdjb139VWzPFOlE02tQUKw2dixTyPzUZ9ZDLgB0Xr\"}"
            ])
        }

        Function("createMph") { (password: String, email: String) -> Void in
            self.sendEvent("onResult", [
                "result" : ""
                // "result": "{\"masterPasswordHash\":\"MgS0Q2ruMsxbH71DBGbWHSTCl\/7\/Pg22G2ET0NxSuao=\",\"encryptionKeys\":\"rAZ2NvXf1VbM8U6UTTa1BQrDZ2LFPI\/NRn1kMuAHRes=:2lK4Iwt1Bdk5trUrhbLKF6wGdjb139VWzPFOlE02tQUKw2dixTyPzUZ9ZDLgB0Xr\"}"
            ])
        }
    }
}
