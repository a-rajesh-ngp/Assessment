import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('file_name').notNullable()
      table.text('path').notNullable()
      table.string('disk').notNullable()
      table.string('mime_type').notNullable()
      table.bigInteger('size').notNullable()
      table
      .integer('uploaded_by')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()

      table.unique(['disk', 'path'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}