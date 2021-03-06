<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license https://craftcms.github.io/license/
 */

namespace markhuot\layoutbuilder\services;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\base\Field;
use craft\db\Table;
use craft\fields\BaseRelationField;
use yii\base\Component;

/**
 * Stolen from craftcms\cms\services\relations because we want to allow non-BaseRelationField
 * to be passed as the first argument
 */
class LayoutRelationsService extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Saves some relations for a field.
     *
     * @param Field $field
     * @param ElementInterface $source
     * @param array $targetIds
     * @throws \Throwable
     */
    public function saveRelations(Field $field, ElementInterface $source, array $targetIds)
    {
        /** @var Element $source */
        if (!is_array($targetIds)) {
            $targetIds = [];
        }

        // Prevent duplicate target IDs.
        $targetIds = array_unique($targetIds);

        $transaction = Craft::$app->getDb()->beginTransaction();

        try {
            // Delete the existing relations
            $oldRelationConditions = [
                'and',
                [
                    'fieldId' => $field->id,
                    'sourceId' => $source->id,
                ]
            ];

            // if ($field->localizeRelations) {
            //     $oldRelationConditions[] = [
            //         'or',
            //         ['sourceSiteId' => null],
            //         ['sourceSiteId' => $source->siteId]
            //     ];
            // }

            Craft::$app->getDb()->createCommand()
                ->delete(Table::RELATIONS, $oldRelationConditions)
                ->execute();

            // Add the new ones
            if (!empty($targetIds)) {
                $values = [];

                // if ($field->localizeRelations) {
                //     $sourceSiteId = $source->siteId;
                // } else {
                    $sourceSiteId = null;
                // }

                foreach ($targetIds as $sortOrder => $targetId) {
                    $values[] = [
                        $field->id,
                        $source->id,
                        $sourceSiteId,
                        $targetId,
                        $sortOrder + 1
                    ];
                }

                $columns = [
                    'fieldId',
                    'sourceId',
                    'sourceSiteId',
                    'targetId',
                    'sortOrder'
                ];
                Craft::$app->getDb()->createCommand()
                    ->batchInsert(Table::RELATIONS, $columns, $values)
                    ->execute();
            }

            $transaction->commit();
        } catch (\Throwable $e) {
            $transaction->rollBack();

            throw $e;
        }
    }
}
