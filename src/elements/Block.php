<?php

namespace markhuot\layoutbuilder\elements;

use Craft;
use craft\base\Element;
use markhuot\layoutbuilder\elements\db\BlockQuery;
use markhuot\layoutbuilder\records\Block as BlockRecord;
use craft\elements\db\ElementQueryInterface;
use markhuot\LayoutBuilder\elements\db\RowQuery;
use markhuot\layoutbuilder\records\BlockType;

class Block extends Element {

    public $blockTypeId;

    static function find(): ElementQueryInterface {
        return new BlockQuery(static::class);
    }

    static function hasTitles(): bool {
        return true;
    }

    static function hasContent(): bool {
        return true;
    }

    function getCpEditUrl() {
        return 'blocks/'.$this->id;
    }

    /**
     * Adds in a dynamic title
     *
     * @param bool $isNew
     * @return bool
     * @throws \Throwable
     * @throws \yii\base\Exception
     * @throws \yii\base\InvalidConfigException
     */
    public function beforeSave(bool $isNew): bool {
        $this->updateTitle();
        return parent::beforeSave($isNew);
    }

    public function updateTitle() {
        $blockType = $this->getType();
        if (!$blockType->hasTitleField) {
            // Make sure that the locale has been loaded in case the title format has any Date/Time fields
            Craft::$app->getLocale();
            // Set Craft to the entry's site's language, in case the title format has any static translations
            $language = Craft::$app->language;
            Craft::$app->language = $this->getSite()->language;
            $this->title = Craft::$app->getView()->renderObjectTemplate($blockType->titleFormat, $this);
            Craft::$app->language = $language;
        }
    }

    function afterSave(bool $isNew) {
        if ($isNew) {
            $record = new BlockRecord;
            $record->id = $this->id;
        }
        else {
            $record = BlockRecord::findOne($this->id);
        }

        $record->blockTypeId = $this->blockTypeId;
        $record->save();

        parent::afterSave($isNew);
    }

    function extraFields() {
        $names = parent::extraFields();
        $names[] = 'type';
        return $names;
    }

    function getType() {
        return BlockType::findOne(['id' => $this->blockTypeId]);
    }

    /**
     * @inheritDoc
     */
    function toArray(array $fields = [], array $expand = [], $recursive = true) {
        $array = parent::toArray($fields, $expand, $recursive);
        $array['__typename'] = 'Block';
        $array['type'] = $this->type->toArray();
        return $array;
    }
}