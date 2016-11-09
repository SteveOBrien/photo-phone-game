angular.module('photoTelephoneApp').config(['$compileProvider', function ($compileProvider) {
    //Use the default whitelist as a base. Remove the first and last /'s as its a RegExp turned to string
    var whitelist = $compileProvider.aHrefSanitizationWhitelist().toString().slice(1, -1);

    //Whitelist data URLs
    whitelist = whitelist.replace(/\|(mailto|tel|file)\|/, '$&data|');
    $compileProvider.aHrefSanitizationWhitelist(new RegExp(whitelist));
}]);