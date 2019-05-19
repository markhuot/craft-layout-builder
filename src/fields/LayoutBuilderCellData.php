<?php

namespace markhuot\layoutbuilder\fields;

use markhuot\layoutbuilder\elements\Block;

/**
 * Class LayoutBuilderCellData
 * @package markhuot\layoutbuilder\fields
 * @property Block $blocks
 */
class LayoutBuilderCellData implements \ArrayAccess, \Iterator {

    protected $data;
    protected $index = 0;

    /** @var Block[] blocks */
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

    public function offsetExists($offset): bool {
        return isset($this->blocks[$offset]);
    }

    public function offsetGet($offset){
        return $this->blocks[$offset];
    }

    public function offsetSet($offset, $value) {
        $this->blocks[$offset] = $value;
    }

    public function offsetUnset($offset) {
        unset($this->blocks[$offset]);
    }

    public function current() {
        return $this->blocks[$this->index];
    }

    public function key() {
        return $this->index;
    }

    public function next() {
        ++$this->index;
    }

    public function rewind() {
        $this->index = 0;
    }

    public function valid(): bool {
        return isset($this->blocks[$this->index]);
    }

    function count() {
        return count($this->blocks);
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