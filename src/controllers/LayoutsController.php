<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\assets\LayoutBuilderAssetBundle;
use markhuot\layoutbuilder\records\Layout;

class LayoutsController extends Controller {

    function actionCreate() {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);
        return $this->renderTemplate('layoutbuilder/layouts/edit');
    }

    function actionStore() {
        $layout = new Layout;
        $layout->title = \Craft::$app->request->getParam('layout.title');
        $layout->cells = json_encode(\Craft::$app->request->getParam('layout.cells'));
        $layout->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirect('/admin/settings/plugins/layoutbuilder/layouts/'.$layout->id);
    }

    function actionShow($layoutId) {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);
        return $this->renderTemplate('layoutbuilder/layouts/edit', [
            'layout' => Layout::findOne(['id' => $layoutId]),
        ]);
    }

    function actionUpdate($layoutId) {
        $layout = Layout::findOne(['id' => $layoutId]);
        $layout->title = \Craft::$app->request->getParam('layout.title');
        $layout->cells = json_encode(\Craft::$app->request->getParam('layout.cells'));
        $layout->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirectToPostedUrl();
    }

}