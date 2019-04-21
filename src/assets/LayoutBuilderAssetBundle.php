<?php

namespace markhuot\layoutbuilder\assets;

use craft\web\AssetBundle;

class LayoutBuilderAssetBundle extends AssetBundle {

    function init() {

        // define the path that your publishable resources live
        $this->sourcePath = '@vendor/markhuot/craft-layout-builder/src/resources';

        // define the dependencies
        $this->depends = [];

        // define the relative path to CSS/JS files that should be registered with the page
        // when this asset bundle is registered
        $this->js = [
            'settings.min.js',
        ];

        $this->css = [
            // 'styles.css',
            // '//cdn.jsdelivr.net/npm/tailwindcss/dist/utilities.min.css',
            'css/icon-picker.css',
            'css/utilities.css',
        ];

        parent::init();
    }

}