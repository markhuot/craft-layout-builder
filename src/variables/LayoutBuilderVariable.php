<?php

namespace markhuot\layoutbuilder\variables;

use markhuot\layoutbuilder\records\BlockType;
use markhuot\layoutbuilder\records\Layout;
use markhuot\layoutbuilder\records\LayoutType;

class LayoutBuilderVariable {

    function getLayoutTypes() {
        $query = LayoutType::find();
        $query->orderBy('title asc');
        return $query;
    }

    function getBlockTypes() {
        $query = BlockType::find();
        $query->orderBy('title asc');
        return $query;
    }

    function getIconSource($iconKey) {
        return file_get_contents(__DIR__.'/../resources/icons/'.$iconKey);
    }

}