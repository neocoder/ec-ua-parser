module.exports = {
    "rules": {
        "indent": [
            2,
            "tab",
			{"SwitchCase": 1}
        ],
        "quotes": [
            2,
            "single",
			{ "allowTemplateLiterals": true }
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [0],
        // "semi": [
        //     2,
        //     "always"
        // ],
        "no-console": [0],
		//"no-unused-vars": ["error", { "vars": "all", "args": "after-used" }]
		"no-unused-vars": [0]
    },
    "env": {
        "es6": true,
        "node": true,
        "browser": true
    },
    "extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module",
        "ecmaFeatures": {
			"jsx": true,
	        "experimentalObjectRestSpread": true
        }
    },
    "plugins": [
        "react"
    ]
};
