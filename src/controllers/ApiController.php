<?php

namespace markhuot\layoutbuilder\controllers;

use craft\web\Controller;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\BlockType;
use markhuot\layoutbuilder\records\Layout;
use markhuot\layoutbuilder\records\LayoutType;
use yii\db\ActiveQuery;

class ApiController extends Controller {

    function actionElements() {
        /** @var ActiveQuery[] $queries */
        $queries = [
            'layoutTypes' => LayoutType::find()->orderBy('title asc'),
            'blockTypes' => BlockType::find()->orderBy('title asc'),
            'blocks' => Block::find()->limit(10),
        ];

        if ($q = \Craft::$app->request->getParam('q')) {
            foreach ($queries as $query) {
                $query->where('title LIKE :title', [':title' => "%{$q}%"]);
            }
        }

        $layoutTypes = array_map(function ($layoutType) {
            return $layoutType->toArray();
        }, $queries['layoutTypes']->all());

        $blockTypes = array_map(function ($blockType) {
            return $blockType->toArray();
        }, $queries['blockTypes']->all());

        $recentBlocks = array_map(function ($block) {
            return $block->toArray();
        }, $queries['blocks']->all());

        return $this->asJson([
            'layoutTypes' => $layoutTypes,
            'blockTypes' => $blockTypes,
            'blocks' => $recentBlocks,
        ]);
    }

}