<?php

namespace markhuot\layoutbuilder\elements;

use Craft;
use craft\base\Element;
use craft\base\ElementTrait;
use craft\elements\db\EntryQuery;
use craft\elements\Entry;
use markhuot\layoutbuilder\elements\db\BlockQuery;
use markhuot\layoutbuilder\records\Block as BlockRecord;
use craft\elements\db\ElementQueryInterface;
use markhuot\LayoutBuilder\elements\db\RowQuery;
use markhuot\layoutbuilder\records\BlockType;
use yii\base\InvalidConfigException;

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

    protected static function defineSources(string $context = null): array
    {
        $sources = [
            [
                'key' => '*',
                'label' => 'All Blocks',
                'criteria' => []
            ],
        ];

        foreach (BlockType::find()->orderBy('title asc')->all() as $blockType) {
            $sources[] = [
                'key' => $blockType->handle,
                'label' => $blockType->title,
                'criteria' => [
                    'typeId' => $blockType->id,
                ]
            ];
        }

        return $sources;
    }

    protected static function defineActions(string $source = null): array {
        $actions = [];

        // $actions[] = [
        //
        // ];

        return $actions;
    }

    protected static function defineTableAttributes(): array
    {
        return [
            'title' => Craft::t('app', 'Title'),
            'type' => Craft::t('app', 'Type'),
            'relatedCount' => Craft::t('app', 'Related'),
        ];
    }

    protected function tableAttributeHtml(string $attribute): string {
        switch ($attribute) {
            case 'type':
                try {
                    return Craft::t('site', $this->getType()->title);
                } catch (\Exception $e) {
                    return Craft::t('app', 'Unknown');
                }

            case 'relatedCount':
                return (new EntryQuery(Entry::class))->relatedTo($this)->count();
        }

        return parent::tableAttributeHtml($attribute);
    }

    protected static function defineSortOptions(): array
    {
        return [
            [
                'label' => Craft::t('app', 'Title'),
                'orderBy' => 'content.title',
                'attribute' => 'title',
            ],
            [
                'label' => Craft::t('app', 'Type'),
                'orderBy' => 'layoutbuilder_blocktypes.title',
                'attribute' => 'type',
            ],
            // [
            //     'label' => Craft::t('app', 'Related'),
            //     'orderBy' => 'layoutbuilder_blocktypes.title',
            //     'attribute' => 'related',
            // ],
        ];
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