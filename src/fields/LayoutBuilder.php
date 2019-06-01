<?php

namespace markhuot\layoutbuilder\fields;

use Craft;
use craft\base\Element;
use craft\base\Field;
use craft\base\ElementInterface;
use craft\fields\BaseRelationField;
use markhuot\layoutbuilder\assets\FieldInputAssetBundle;
use markhuot\layoutbuilder\elements\Block;
use markhuot\LayoutBuilder\elements\Row;
use markhuot\layoutbuilder\records\Layout;
use yii\db\Expression;
use yii\db\Schema;

class LayoutBuilder extends Field {

    /**
     * @inheritdoc
     */
    static function displayName(): string
    {
        return Craft::t('app', 'Layout Builder');
    }

    /**
     * @inheritdoc
     */
    public function getContentColumnType(): string
    {
        return Schema::TYPE_TEXT;
    }

    /**
     * @inheritDoc
     */
    function getInputHtml($value, ElementInterface $element = null): string
    {
        /** @var LayoutBuilderFieldData $value */

        Craft::$app->view->registerAssetBundle(FieldInputAssetBundle::class);

        return Craft::$app->getView()->renderTemplate('layoutbuilder/field/input', [
            'id' => $this->handle.'-'.$element->getId(),
            'name' => $this->handle,
            'element' => $element,
            'value' => $value->toArray(),
            'field' => $this,
        ]);
    }

    /**
     * @param ElementInterface $element
     * @param bool $isNew
     * @return bool
     * @throws \Throwable
     * @throws \craft\errors\ElementNotFoundException
     * @throws \yii\base\Exception
     */
    function beforeElementSave(ElementInterface $element, bool $isNew): bool {
        $fields = [];
        foreach ($element->fieldLayout->fields as $field) {
            if (is_a($field, LayoutBuilder::class)) {
                $fields[] = $field;
            }
        }

        foreach ($fields as $field) {
            $relations = [];

            foreach (Craft::$app->request->getParam("fields.{$field->handle}", []) as $index => $layoutData) {
                $uid = $layoutData['uid'];
                $typeId = $layoutData['layoutTypeId'];

                $layoutElement = \markhuot\layoutbuilder\elements\Layout::find()->where(['{{%elements}}.uid' => $uid])->one();
                if (!$layoutElement) {
                    $layout = new \markhuot\layoutbuilder\elements\Layout;
                    $layout->layoutTypeId = $typeId;
                    // $layout->setFieldValuesFromRequest('fields');
                    Craft::$app->elements->saveElement($layout);

                    $layoutElement = \craft\records\Element::findOne($layout->id);
                    $layoutElement->uid = $uid;
                    $layoutElement->save();
                }

                $relations[] = $layoutElement->id;
                $blockIds = [];
                $blockUids = [];
                $cells = @$layoutData['blocks'] ?: [];
                foreach ($cells as $cell) {
                    $blockUids = array_merge($blockUids, $cell);
                }
                if (!empty($blockUids)) {
                    $blocks = Block::find()->where(['{{%elements}}.uid' => $blockUids])->all();
                    $blockIds = array_map(function ($block) {
                        return $block->id;
                    }, $blocks);
                }

                if (!empty($blockIds)) {
                    $relations = array_merge($relations, $blockIds);
                }
            }

            \markhuot\layoutbuilder\LayoutBuilder::getInstance()->layoutRelations->saveRelations($field, $element, $relations);
        }

        return parent::beforeElementSave($element, $isNew);
    }

    /**
     * @inheritDoc
     */
    function serializeValue($value, ElementInterface $element = null) {
        return parent::serializeValue($value->getRawData(), $element);
    }

    /**
     * @inheritDoc
     */
    function normalizeValue($value, ElementInterface $element = null) {
        // if it's from the DB it'll be a string, if it's a POST from
        // a form submission it'll be an array. That's silly.
        if (is_string($value)) {
            $value = json_decode($value, true) ?: [];
        }

        return new LayoutBuilderFieldData($value ?: []);
    }

}