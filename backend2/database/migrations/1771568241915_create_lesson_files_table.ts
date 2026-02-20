import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
      .integer('lesson_id')
      .unsigned()
      .references('id')
      .inTable('lessons')
      .onDelete('CASCADE')
      .notNullable()

      table
      .integer('file_id')
      .unsigned()
      .references('id')
      .inTable('files')
      .onDelete('CASCADE')
      .notNullable()

      table.unique(['lesson_id', 'file_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}