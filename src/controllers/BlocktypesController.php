<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\assets\LayoutBuilderAssetBundle;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\BlockType;

class BlocktypesController extends Controller {

    function actionCreate() {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);

        $blockType = new BlockType;
        $blockType->hasTitleField = true;

        return $this->renderTemplate('layoutbuilder/blocktypes/edit', [
            'blockType' => $blockType
        ]);
    }

    function actionStore() {
        // assemble the new one from the post data, and save it
        $fieldLayout = \Craft::$app->getFields()->assembleLayoutFromPost();
        $fieldLayout->type = Block::class;
        \Craft::$app->getFields()->saveLayout($fieldLayout);

        $blockType = new BlockType;
        $blockType->title = \Craft::$app->request->getParam('blockType.title');
        $blockType->handle = \Craft::$app->request->getParam('blockType.handle');
        $blockType->icon = \Craft::$app->request->getParam('blockType.icon');
        $blockType->hasTitleField = \Craft::$app->request->getParam('blockType.hasTitleField');
        $blockType->titleLabel = \Craft::$app->request->getParam('blockType.titleLabel');
        $blockType->titleFormat = \Craft::$app->request->getParam('blockType.titleFormat');
        $blockType->fieldLayoutId = $fieldLayout->id;
        $blockType->save();

        \Craft::$app->session->setNotice('Block type saved');
        return $this->redirect('/admin/settings/plugins/layoutbuilder/blocktypes/'.$blockType->id);
    }

    function actionShow($blockTypeId) {
        $this->view->registerAssetBundle(LayoutBuilderAssetBundle::class);
        $blockType = BlockType::findOne(['id' => $blockTypeId]);

        return $this->renderTemplate('layoutbuilder/blocktypes/edit', [
            'blockType' => $blockType,
        ]);
    }

    function actionUpdate($blockTypeId) {
        // assemble the new one from the post data, and save it
        $fieldLayout = \Craft::$app->getFields()->assembleLayoutFromPost();
        $fieldLayout->type = Block::class;
        \Craft::$app->getFields()->saveLayout($fieldLayout);

        $blockType = BlockType::findOne(['id' => $blockTypeId]);
        $blockType->title = \Craft::$app->request->getParam('blockType.title');
        $blockType->handle = \Craft::$app->request->getParam('blockType.handle');
        $blockType->icon = \Craft::$app->request->getParam('blockType.icon');
        $blockType->hasTitleField = \Craft::$app->request->getParam('blockType.hasTitleField');
        $blockType->titleLabel = \Craft::$app->request->getParam('blockType.titleLabel');
        $blockType->titleFormat = \Craft::$app->request->getParam('blockType.titleFormat');
        $blockType->fieldLayoutId = $fieldLayout->id;
        $blockType->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirectToPostedUrl();
    }

}