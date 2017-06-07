### Custom Libraries
 
To define a custom library you will first need to place your extracted library source code within the libraries folder.

Each library requires a composer.json to be located within the libraries sub-directory which wil be used to reference your custom library from the primary composer.json file on composer install.

#### Custom Library composer.json
```
  {
    "name": "library/library",
    "description": "Library Description",
    "version": "1.0.0",
    "type" : "drupal-library"
  }
```

#### Primary Build composer.json 
```
  "repositories": [
    {
      "type": "path",
      "url": "./libraries/library"
    }
  ],
  "require": {
    "library/library": "1.0.0"
  },
  
```
