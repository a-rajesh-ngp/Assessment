import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('course_id')
      .unsigned()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE')
      .notNullable()

      table.string('title').notNullable()
      table.string('type').notNullable()
      table.string('content').notNullable()
      table.integer('order').notNullable()

      table.unique(['course_id', 'order'])


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}