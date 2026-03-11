import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assignments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .boolean('is_submission_allowed')
        .notNullable()
        .defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_submission_allowed')
    })
  }
}