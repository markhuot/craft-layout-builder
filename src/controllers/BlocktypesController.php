<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\BlockType;

class BlocktypesController extends Controller {

    function actionCreate() {
        return $this->renderTemplate('layoutbuilder/blocktypes/edit');
    }

    function actionStore() {
        // assemble the new one from the post data, and save it
        $fieldLayout = \Craft::$app->getFields()->assembleLayoutFromPost();
        $fieldLayout->type = Block::class;
        \Craft::$app->getFields()->saveLayout($fieldLayout);

        $blockType = new BlockType;
        $blockType->title = \Craft::$app->request->getParam('blockType.title');
        $blockType->icon = \Craft::$app->request->getParam('blockType.icon');
        $blockType->fieldLayoutId = $fieldLayout->id;
        $blockType->save();

        \Craft::$app->session->setNotice('Block type saved');
        return $this->redirect('/admin/settings/plugins/layoutbuilder/blocktypes/'.$blockType->id);
    }

    function actionShow($blockTypeId) {
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
        $blockType->icon = \Craft::$app->request->getParam('blockType.icon');
        $blockType->fieldLayoutId = $fieldLayout->id;
        $blockType->save();

        \Craft::$app->getSession()->setNotice('Layout saved');
        return $this->redirectToPostedUrl();
    }

}