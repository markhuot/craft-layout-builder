<?php

namespace markhuot\layoutbuilder\fields;

use craft\records\Element;
use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\elements\Layout;
use markhuot\layoutbuilder\records\LayoutType;

/**
 * Class LayoutBuilderFieldData
 * @package markhuot\layoutbuilder\fields
 * @property Layout[] $layouts
 */
class LayoutBuilderFieldData {

    /**
     * $data is a JSON object representing the field data. It looks something like this,
     *
     * $value => [
     *   0 => [
     *     'uid' => 'uid-of-layout',
     *     'blocks' => ['block-uid', 'second-block-uid'],
     *   ],
     *   0 => [
     *     'uid' => 'uid-of-second-layout',
     *     'blocks' => ['block-uid', 'second-block-uid'],
     *   ]
     * ]
     * @var array
     */
    protected $data = [];

    function __construct(array $data) {
        $this->data = $data;

        // @todo refactor layout saving
        // all this DB stuff shouldn't happen here. It should be in the field save
        // method so that $data _always_ comes in to here with existing and valid
        // layouts
        $layoutUids = [];
        $layoutTypeMapping = [];
        foreach ($this->data as $layout) {
            $layoutUids[] = $layout['uid'];
            $layoutTypeMapping[$layout['uid']] = $layout['layoutTypeId'];
        }

        $storedLayoutUids = [];
        $layouts = Layout::find()->where(['{{%elements}}.uid' => $layoutUids])->all();
        foreach ($layouts as $layout) {
            $storedLayoutUids[] = $layout->uid;
        }

        $missingLayoutUids = array_diff($layoutUids, $storedLayoutUids);

        foreach ($missingLayoutUids as $missingLayoutUid) {
            $layout = new Layout;
            $layout->layoutTypeId = $layoutTypeMapping[$missingLayoutUid];
            $layout->setFieldValuesFromRequest('fields');
            \Craft::$app->elements->saveElement($layout);

            $layoutElement = Element::findOne($layout->id);
            $layoutElement->uid = $missingLayoutUid;
            $layoutElement->save();

            // overwrite the UID on our object, in case it's referenced
            // later in the code without a fresh fetch from the DB
            $layout->uid = $missingLayoutUid;
        }
    }

    function __get($key) {
        return $this->{'get'.ucfirst($key)}();
    }

    function __isset($key) {
        return $this->{'isset'.ucfirst($key)}();
    }

    function getLayouts() {
        $layoutUids = [];
        $blockUids = [];

        foreach ($this->data as $layout) {
            $layoutUids[] = $layout['uid'];
            foreach (@$layout['blocks'] ?: [] as $blocks) {
                $blockUids = array_merge($blockUids, $blocks);
            }
        }

        $layoutModels = Layout::find()->where(['{{%elements}}.uid' => $layoutUids])->indexBy('uid')->all();
        $blockModels = Block::find()->where(['{{%elements}}.uid' => $blockUids])->indexBy('uid')->all();

        return array_map(function ($layout) use ($layoutModels, $blockModels) {
            $layout['blocks'] = @$layout['blocks'] ?: [];
            foreach ($layout['blocks'] as $cellUid => &$blocks) {
                foreach ($blocks as &$block) {
                    $block = $blockModels[$block];
                }
            }
            return $layoutModels[$layout['uid']]->withBlocks($layout['blocks']);
        }, $this->data);
    }

    function issetLayouts() {

    }

    function getRawData() {
        return $this->data;
    }

    function toArray() {
        return array_map(function ($layout) {
            return $layout->toArray();
        }, $this->getLayouts());
    }

}