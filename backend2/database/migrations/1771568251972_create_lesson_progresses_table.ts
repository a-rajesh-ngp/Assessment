import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lesson_progresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()

      table
      .integer('lesson_id')
      .unsigned()
      .references('id')
      .inTable('lessons')
      .onDelete('CASCADE')
      .notNullable()

      table.boolean('completed').notNullable()

      table.unique(['user_id', 'lesson_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}