<?php

namespace markhuot\LayoutBuilder\controllers;

use Craft;
use craft\elements\Entry;
use craft\web\Controller;
use markhuot\LayoutBuilder\elements\Row;

class ElementController extends Controller {

    function actionNew() {
        $section = Craft::$app->sections->getSectionById(4);
        $entryType = Craft::$app->sections->getEntryTypeById(4);

        $entry = new Entry;
        $entry->typeId = $entryType->id;
        $entry->sectionId = $section->id;

        return Craft::$app->getView()->renderTemplate('layoutbuilder/modal/edit', [
            'entryType' => $entryType,
            'entry' => $entry,
            'section' => $section,
        ]);
    }

    function actionSave() {

    }

}