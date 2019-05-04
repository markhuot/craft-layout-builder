<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\assets\LayoutBuilderAssetBundle;
use markhuot\layoutbuilder\records\LayoutType;

class LayouttypesController extends Controller {

    function actionCreate() {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);
        return $this->renderTemplate('layoutbuilder/layouttypes/edit');
    }

    function actionStore() {
        $layout = new LayoutType;
        $layout->title = \Craft::$app->request->getParam('layout.title');
        $layout->icon = \Craft::$app->request->getParam('layout.icon');
        $layout->cells = json_encode(\Craft::$app->request->getParam('layout.cells'));
        $layout->useCustomCss = \Craft::$app->request->getParam('layout.useCustomCss');
        $layout->customCss = \Craft::$app->request->getParam('layout.customCss');
        $layout->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirect('/admin/settings/plugins/layoutbuilder/layouttypes/'.$layout->id);
    }

    function actionShow($layoutId) {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);
        return $this->renderTemplate('layoutbuilder/layouttypes/edit', [
            'layoutType' => LayoutType::findOne(['id' => $layoutId]),
        ]);
    }

    function actionUpdate($layoutId) {
        $layout = LayoutType::findOne(['id' => $layoutId]);
        $layout->title = \Craft::$app->request->getParam('layout.title');
        $layout->icon = \Craft::$app->request->getParam('layout.icon');
        $layout->cells = json_encode(\Craft::$app->request->getParam('layout.cells'));
        $layout->useCustomCss = \Craft::$app->request->getParam('layout.useCustomCss');
        $layout->customCss = \Craft::$app->request->getParam('layout.customCss');
        $layout->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirectToPostedUrl();
    }

}