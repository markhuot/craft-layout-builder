<?php

namespace markhuot\layoutbuilder\elements\db;

use craft\elements\db\ElementQuery;

class LayoutQuery extends ElementQuery {

    function beforePrepare(): bool {
        $this->joinElementTable('layoutbuilder_layouts');

        $this->query->select([
            'layoutbuilder_layouts.layoutTypeId',
        ]);

        return parent::beforePrepare();
    }

}