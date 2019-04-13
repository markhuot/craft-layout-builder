<?php

namespace markhuot\layoutbuilder\migrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\db\Table;
use craft\models\FieldLayout;
use markhuot\LayoutBuilder\elements\Row;

/**
 * Install migration
 */
class Install extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('{{%layoutbuilder_layouts}}', [
            'id' => $this->primaryKey(),
            'title' => $this->string(),
            'handle' => $this->string(),
            'icon' => $this->string()->null(),
            'cells' => $this->text(),
            'dateCreated' => $this->dateTime(),
            'dateUpdated' => $this->dateTime(),
            'uid' => $this->string(),
        ]);

        $this->createTable('{{%layoutbuilder_blocktypes}}', [
            'id' => $this->primaryKey(),
            'fieldLayoutId' => $this->integer()->unsigned(),
            'title' => $this->string(),
            'handle' => $this->string(),
            'icon' => $this->string()->null(),
            'dateCreated' => $this->dateTime(),
            'dateUpdated' => $this->dateTime(),
            'uid' => $this->string(),
        ]);

        $this->createTable('{{%layoutbuilder_blocks}}', [
            'id' => $this->primaryKey(),
            'blockTypeId' => $this->integer()->unsigned(),
            'dateCreated' => $this->dateTime(),
            'dateUpdated' => $this->dateTime(),
            'uid' => $this->string(),
        ]);

        $this->addForeignKey(null, '{{%layoutbuilder_blocks}}', ['id'], Table::ELEMENTS, ['id'], 'CASCADE', null);

        // $this->createTable('{{%layoutrows}}', [
        //     'id' => $this->primaryKey(),
        //     'elementId' => $this->integer()->notNull(),
        //     'fieldId' => $this->integer()->notNull(),
        //     'layout' => $this->integer()->notNull(),
        //     'dateCreated' => $this->timestamp(),
        //     'dateUpdated' => $this->timestamp(),
        //     'uid' => $this->uid(),
        // ]);
        //
        // // give it a FK to the elements table
        // $this->addForeignKey(
        //     $this->db->getForeignKeyName('{{%layoutrows}}', 'id'),
        //     '{{%layoutrows}}', 'id', '{{%elements}}', 'id', 'CASCADE', null);
        //
        // $this->createTable('layoutrelations', [
        //     'id' => $this->primaryKey(),
        //     'rowId' => $this->integer()->notNull(),
        //     'columnIndex' => $this->integer()->notNull(),
        //     'targetId' => $this->integer()->notNull(),
        //     'sortOrder' => $this->integer()->notNull()->defaultValue(1),
        // ]);
        //
        // // create the field group
        // $groupModel = new \craft\models\FieldGroup;
        // $groupModel->name = 'Layout Builder';
        // Craft::$app->fields->saveGroup($groupModel);
        //
        // // create the layout field
        // $layoutField = new \craft\fields\PlainText;
        // $layoutField->groupId = $groupModel->id;
        // $layoutField->name = 'Layout';
        // $layoutField->handle = 'layoutBuilderLayout';
        // $layoutField->required = false;
        // $layoutField->sortOrder = 0;
        // Craft::$app->fields->saveField($layoutField);
        //
        // // add field layout
        // $fieldLayout = new \craft\models\FieldLayout;
        // $fieldLayout->type = \markhuot\LayoutBuilder\elements\Row::class;
        //
        // $fieldLayoutTab = new \craft\models\FieldLayoutTab;
        // $fieldLayoutTab->setLayout($fieldLayout);
        // $fieldLayoutTab->name = 'Content';
        // $fieldLayoutTab->setFields([
        //     $layoutField,
        // ]);
        //
        // $fieldLayout->setTabs([$fieldLayoutTab]);
        // Craft::$app->fields->saveLayout($fieldLayout);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        // $field = Craft::$app->fields->getFieldByHandle('layoutBuilderLayout');
        // Craft::$app->fields->deleteField($field);
        //
        // Craft::$app->getDb()->createCommand()
        //     ->delete('{{%fieldgroups}}', ['name' => 'Layout Builder'])
        //     ->execute();
        //
        // Craft::$app->getDb()->createCommand()
        //     ->delete('{{%fieldlayouts}}', ['type' => Row::class])
        //     ->execute();

        $this->dropTableIfExists('{{%layoutbuilder_layouts}}');
        $this->dropTableIfExists('{{%layoutbuilder_blocktypes}}');
        $this->dropTableIfExists('{{%layoutbuilder_blocks}}');
        // $this->dropTable('{{%layoutrows}}');
        // $this->dropTable('{{%layoutrelations}}');
    }
}
