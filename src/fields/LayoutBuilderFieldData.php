<?php

namespace markhuot\layoutbuilder\fields;

use markhuot\layoutbuilder\elements\Block;
use markhuot\layoutbuilder\records\Layout;

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

        $layoutModels = Layout::find()->where(['uid' => $layoutUids])->indexBy('uid')->all();
        $blockModels = Block::find()->where(['{{%elements}}.uid' => $blockUids])->indexBy('uid')->all();

        // array_map(function ($blockUid) use ($blockModels) {
        //     return $blockModels[$blockUid];
        // }, @$layout['blocks'] ?: [])
        // var_dump($this->data[0]);

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