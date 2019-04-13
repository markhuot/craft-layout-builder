<?php

namespace markhuot\layoutbuilder\fields;

use Craft;
use craft\base\Field;
use craft\base\ElementInterface;
use markhuot\layoutbuilder\assets\FieldInputAssetBundle;
use markhuot\layoutbuilder\elements\Block;
use markhuot\LayoutBuilder\elements\Row;
use markhuot\layoutbuilder\records\Layout;
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
     * @inheritdoc
     *
     * $value is a JSON object representing the layout. It looks something like this,
     *
     * $value => [
     *   'layouts' => [
     *     'uid-v4-of-layout1',
     *     'uid-v4-of-layout2',
     *     'uid-v4-of-layout3',
     *   ]
     *   blocks => [
     *
     *   ]
     * ]
     */
    function getInputHtml($value, ElementInterface $element = null): string
    {
        Craft::$app->view->registerAssetBundle(FieldInputAssetBundle::class);

        if (is_string($value)) {
            $value = json_decode($value, true);
        }

        foreach ($value as &$layout) {
            $blocks = @$layout['blocks'] ?: [];
            $layout = Layout::findOne(['uid' => $layout['uid']])->toArray();
            foreach ($layout['cells'] as &$row) {
                foreach ($row as &$cell) {
                    if (isset($blocks[$cell['uid']])) {
                        $cell['blocks'] = array_map(function ($block) {
                            return $block->toArray();
                        }, Block::findAll(['uid' => $blocks[$cell['uid']]]));
                        // }, Block::findAll(['uid' => $blocks[$cell['uid']]]));
                        // var_dump($cell['blocks']);
                        // die;
                    }
                }
            }
            // var_dump($layout);
            // die;
        }
        $value = json_encode($value);

        return Craft::$app->getView()->renderTemplate('layoutbuilder/field/input', [
            'id' => $this->handle.'-'.$element->getId(),
            'name' => $this->handle,
            'element' => $element,
            'value' => $value,
            'field' => $this,
        ]);
    }

    /**
     * @inheritDoc
     */
    function serializeValue($value, ElementInterface $element = null) {
        return parent::serializeValue($value, $element);
    }

}