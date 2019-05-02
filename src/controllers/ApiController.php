<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\BlockType;
use markhuot\layoutbuilder\records\Layout;

class ApiController extends Controller {

    function actionElements() {
        $layouts = array_map(function ($layout) {
            return $layout->toArray();
        }, Layout::find()->orderBy('title asc')->all());

        $blockTypes = array_map(function ($blockType) {
            return $blockType->toArray();
        }, BlockType::find()->orderBy('title asc')->all());

        $recentBlocks = array_map(function ($block) {
            return $block->toArray();
        }, Block::find()->limit(10)->all());

        return $this->asJson([
            'layouts' => $layouts,
            'blockTypes' => $blockTypes,
            'blocks' => $recentBlocks,
        ]);
    }

}