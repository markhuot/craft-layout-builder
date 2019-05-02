<?php

namespace markhuot\layoutbuilder\fields;

use markhuot\layoutbuilder\elements\Block;

/**
 * Class LayoutBuilderCellData
 * @package markhuot\layoutbuilder\fields
 * @property Block $blocks
 */
class LayoutBuilderCellData {

    protected $data;
    protected $blocks = [];

    function __construct(array $data) {
        $this->data = $data;
    }

    function __get($key) {
        return $this->{'get'.ucfirst($key)}();
    }

    function __isset($key) {
        return method_exists($this, 'get'.ucfirst($key));
    }

    function withBlocks(array $blocks) {
        $this->blocks = $blocks;
        return $this;
    }

    function getUid() {
        return $this->data['uid'];
    }

    function getTitle() {
        return $this->data['title'];
    }

    function getWidth() {
        return $this->data['width'];
    }

    function getCustomCss() {
        return $this->data['customCss'];
    }

    function getBlocks() {
        return $this->blocks;
    }

    function toArray() {
        return [
            'uid' => $this->getUid(),
            'title' => $this->getTitle(),
            'width' => $this->getWidth(),
            'customCss' => $this->getCustomCss(),
            'blocks' => array_map(function ($block) { return $block->toArray(); }, $this->getBlocks()),
        ];
    }

}