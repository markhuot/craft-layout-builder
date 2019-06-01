<?php

namespace markhuot\layoutbuilder\controllers;

use Craft;
use craft\records\Element;
use craft\web\Controller;
use markhuot\layoutbuilder\assets\FieldInputAssetBundle;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\BlockType;

class BlocksController extends Controller {

    function actionIndex() {
        return $this->renderTemplate('layoutbuilder/blocks/index', []);
    }

    function actionCreate($blockTypeHandle) {
        Craft::$app->view->registerAssetBundle(FieldInputAssetBundle::class);

        $blockType = BlockType::findOne(['handle' => $blockTypeHandle]);

        $block = new Block;
        $block->fieldLayoutId = $blockType->fieldLayoutId;
        $block->blockTypeId = $blockType->id;
        $block->uid = Craft::$app->request->getParam('uid');
        $tabs = [];

        foreach ($block->getFieldLayout()->getTabs() as $index => $tab) {
            $tabs[] = [
                'label' => Craft::t('site', $tab->name),
                'url' => '#'.$tab->getHtmlId(),
                'class' => null,
            ];
        }

        return $this->renderTemplate('layoutbuilder/blocks/edit', [
            'withFrame' => !!Craft::$app->request->getParam('withFrame', true),
            'block' => $block,
            'tabs' => $tabs,
        ]);
    }

    function actionStore($blockTypeHandle) {
        $blockType = BlockType::findOne(['handle' => $blockTypeHandle]);
        $withFrame = !!Craft::$app->request->getParam('layout.withFrame');
        $redirect = Craft::$app->request->getParam('redirect');

        $block = new Block;
        // $block->uid = Craft::$app->request->getParam('uid'); // doesn't actually save...
        $block->fieldLayoutId = $blockType->fieldLayoutId;
        $block->title = Craft::$app->request->getParam('title');
        $block->blockTypeId = Craft::$app->request->getParam('block.blockTypeId');
        $block->setFieldValuesFromRequest('fields');
        Craft::$app->elements->saveElement($block);

        Craft::$app->session->setNotice('Block updated');

        if ($uid = Craft::$app->request->getParam('uid')) {
            $blockRecord = Element::findOne($block->id);
            $blockRecord->uid = $uid;
            $blockRecord->save();

            // overwrite the uid for the JSON response below
            $block->uid = $uid;
        }

        if ($redirect || $withFrame) {
            return $this->redirect($block->getCpEditUrl() . ($withFrame ? '' : '?withFrame=0'));
        }

        return $this->renderTemplate('layoutbuilder/blocks/iframe/done', [
            'block' => $block,
        ]);
    }

    function actionShow($blockId) {
        Craft::$app->view->registerAssetBundle(FieldInputAssetBundle::class);

        $block = Block::findOne($blockId);
        $tabs = [];

        foreach ($block->getFieldLayout()->getTabs() as $index => $tab) {
            $tabs[] = [
                'label' => Craft::t('site', $tab->name),
                'url' => '#'.$tab->getHtmlId(),
                'class' => null,
            ];
        }

        return $this->renderTemplate('layoutbuilder/blocks/edit', [
            'withFrame' => !!Craft::$app->request->getParam('withFrame', true),
            'block' => $block,
            'tabs' => $tabs,
        ]);
    }

    function actionUpdate($blockId) {
        $withFrame = !!Craft::$app->request->getParam('layout.withFrame');
        $redirect = Craft::$app->request->getParam('redirect');

        $block = Block::findOne($blockId);
        $block->title = Craft::$app->request->getParam('title');
        $block->setFieldValuesFromRequest('fields');
        Craft::$app->elements->saveElement($block);

        Craft::$app->session->setNotice('Block updated');

        if ($redirect || $withFrame) {
            return $this->redirect($block->getCpEditUrl() . ($withFrame ? '' : '?withFrame=0'));
        }

        return $this->renderTemplate('layoutbuilder/blocks/iframe/done', [
            'block' => $block,
        ]);
    }

}