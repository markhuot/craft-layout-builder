<?php

namespace markhuot\layoutbuilder;

use craft\base\Plugin;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterTemplateRootsEvent;
use craft\services\Fields;
use craft\events\RegisterUrlRulesEvent;
use craft\web\twig\variables\CraftVariable;
use craft\web\UrlManager;
use craft\web\View;
use markhuot\layoutbuilder\services\LayoutsService;
use markhuot\layoutbuilder\variables\LayoutBuilderVariable;
use yii\base\Event;
use markhuot\layoutbuilder\fields\LayoutBuilder as LayoutBuilderField;

class LayoutBuilder extends Plugin
{
    public $schemaVersion = '1.0.0';
    public $controllerNamespace = 'markhuot\\layoutbuilder\\controllers';
    public $hasCpSettings = true;
    public $hasCpSection = false;

    /**
     * Init for the entire plugin
     *
     * @return void
     */
    function init() {
        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, function (RegisterUrlRulesEvent $event) {
            $event->rules['GET layoutbuilder/api/elements'] = 'layoutbuilder/api/elements';

            $event->rules['GET settings/plugins/layoutbuilder/layouts/create'] = 'layoutbuilder/layouts/create';
            $event->rules['POST settings/plugins/layoutbuilder/layouts/create'] = 'layoutbuilder/layouts/store';
            $event->rules['GET settings/plugins/layoutbuilder/layouts/<layoutId:\d+>'] = 'layoutbuilder/layouts/show';
            $event->rules['POST settings/plugins/layoutbuilder/layouts/<layoutId:\d+>'] = 'layoutbuilder/layouts/update';

            $event->rules['GET settings/plugins/layoutbuilder/blocktypes/create'] = 'layoutbuilder/blocktypes/create';
            $event->rules['POST settings/plugins/layoutbuilder/blocktypes/create'] = 'layoutbuilder/blocktypes/store';
            $event->rules['GET settings/plugins/layoutbuilder/blocktypes/<blockTypeId:\d+>'] = 'layoutbuilder/blocktypes/show';
            $event->rules['POST settings/plugins/layoutbuilder/blocktypes/<blockTypeId:\d+>'] = 'layoutbuilder/blocktypes/update';

            $event->rules['GET blocks/<blockTypeHandle:.+>/new'] = 'layoutbuilder/blocks/create';
            $event->rules['POST blocks/<blockTypeHandle:.+>/new'] = 'layoutbuilder/blocks/store';
            $event->rules['GET blocks/<blockId:\d+>'] = 'layoutbuilder/blocks/show';
            $event->rules['POST blocks/<blockId:\d+>'] = 'layoutbuilder/blocks/update';
        });

        Event::on(View::class, View::EVENT_REGISTER_CP_TEMPLATE_ROOTS, function (RegisterTemplateRootsEvent $event) {
            $event->roots['layoutbuilder'] = realpath(__DIR__.'/templates/');
        });

        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function(RegisterComponentTypesEvent $event) {
            $event->types[] = LayoutBuilderField::class;
        });

        Event::on(CraftVariable::class, CraftVariable::EVENT_INIT, function (Event $e) {
            /** @var CraftVariable $variable */
            $variable = $e->sender;

            $variable->set('layoutbuilder', LayoutBuilderVariable::class);
        });
    }

    /**
     * Settings HTML
     *
     * @return string
     */
    protected function settingsHtml() {
        return \Craft::$app->getView()->renderTemplate('layoutbuilder/settings', [
            'settings' => $this->getSettings()
        ]);
    }
}
