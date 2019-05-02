<?php

namespace markhuot\layoutbuilder\fields;

use Craft;
use craft\base\Field;
use craft\base\ElementInterface;
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