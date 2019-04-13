<?php

namespace markhuot\LayoutBuilder\controllers;

use Craft;
use craft\web\Controller;
use markhuot\LayoutBuilder\elements\Row;

class RowController extends Controller {

    function actionStore() {
        $elementId = Craft::$app->request->getParam('elementId');
        $fieldId = Craft::$app->request->getParam('fieldId');

        $row = new Row;
        $row->elementId = $elementId;
        $row->fieldId = $fieldId;

        $success = Craft::$app->elements->saveElement($row);

        return $success ? 'yay!' : 'boo :(';
    }

}