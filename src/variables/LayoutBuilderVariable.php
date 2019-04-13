<?php

namespace markhuot\layoutbuilder\variables;

use markhuot\layoutbuilder\records\BlockType;
use markhuot\layoutbuilder\records\Layout;

class LayoutBuilderVariable {

    function getLayouts() {
        $query = Layout::find();
        $query->orderBy('title asc');
        return $query;
    }

    function getBlockTypes() {
        $query = BlockType::find();
        $query->orderBy('title asc');
        return $query;
    }

}