var SocialLoginClass = require('social-login');

module.exports = function(app) {

    var socialLogin = new SocialLoginClass({
        
        returnRaw:  true,
        app : app,
        url : process.env.HOST,
        onAuth : function(req, type, uniqueProperty, accessToken, refreshToken, profile, done) {
            console.log(`\n\n${profile}\n\n`);
            findOrCreate({
                profile:	profile,        // Profile is the user's profile, already filtered to return only the parts that matter (no HTTP response code and that kind of useless data)
                property:	uniqueProperty, // What property in the data is unique: id, ID, name, ...
                type:		type            // What type of login that is: facebook, foursquare, google, ...
            }, function(user) {
                console.log(`\n\n${user}\n\n`);
                done(null, user);   // Return the user and continue
            });
        }
    });

    socialLogin.use({
        facebook:	{
            settings:	{
                clientID:		"222604125335973",
                clientSecret: 	"3f75216f5ccec176b1ce2947520d5771",
                authParameters:	{
                    scope: 'read_stream,manage_pages'
                }
            },
            url:	{
                auth:		"/auth/facebook",           // The URL to use to login (<a href="/auth/facebook">Login with facebook</a>).
                callback: 	"/auth/facebook/callback",  // The Oauth callback url as specified in your facebook app's settings
                success:	'/dashboard',               // Where to redirect the user once he's logged in
                fail:		'/auth/facebook/fail'       // Where to redirect the user if the login failed or was canceled.
            }
        },
        twitter:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/twitter",
                callback: 	"/auth/twitter/callback",
                success:	'/',
                fail:		'/auth/twitter/fail'
            }
        },
        instagram:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/instagram",
                callback: 	"/auth/instagram/callback",
                success:	'/',
                fail:		'/auth/instagram/fail'
            }
        },
        /*github:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/github",
                callback: 	"/auth/github/callback",
                success:	'/',
                fail:		'/auth/github/fail'
            }
        },
        linkedin:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET",
                authParameters:	{
                    scope: ['r_basicprofile', 'r_emailaddress', 'r_fullprofile', 'r_contactinfo', 'r_network', 'rw_nus']
                }
            },
            url:	{
                auth:		"/auth/linkedin",
                callback: 	"/auth/linkedin/callback",
                success:	'/',
                fail:		'/auth/linkedin/fail'
            }
        },*/
        google:	{
            settings:	{}, // Google doesn't take any API key or API secret
            url:	{
                auth:		"/auth/google",
                callback: 	"/auth/google/callback",
                success:	'/',
                fail:		'/auth/google/fail'
            }
        },
        /*amazon:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET",
                authParameters:	{
                    scope: ['profile', 'postal_code']
                }
            },
            url:	{
                auth:		"/auth/amazon",
                callback: 	"/auth/amazon/callback",
                success:	'/',
                fail:		'/auth/amazon/fail'
            }
        },
        dropbox:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/dropbox",
                callback: 	"/auth/dropbox/callback",
                success:	'/',
                fail:		'/auth/dropbox/fail'
            }
        },
        foursquare:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/foursquare",
                callback: 	"/auth/foursquare/callback",
                success:	'/',
                fail:		'/auth/foursquare/fail'
            }
        },
        imgur:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/imgur",
                callback: 	"/auth/imgur/callback",
                success:	'/',
                fail:		'/auth/imgur/fail'
            }
        },
        meetup:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/meetup",
                callback: 	"/auth/meetup/callback",
                success:	'/',
                fail:		'/auth/meetup/fail'
            }
        },
        // http://developer.wordpress.com/docs/oauth2/
        wordpress:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/wordpress",
                callback: 	"/auth/wordpress/callback",
                success:	'/',
                fail:		'/auth/wordpress/fail'
            }
        },
        tumblr:	{
            settings:	{
                clientID: 		"YOUR_API_KEY",
                clientSecret: 	"YOUR_API_SECRET"
            },
            url:	{
                auth:		"/auth/tumblr",
                callback: 	"/auth/tumblr/callback",
                success:	'/',
                fail:		'/auth/tumblr/fail'
            }
        }*/
    });
}