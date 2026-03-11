import { BaseSchema } from '@adonisjs/lucid/schema'


export default class extends BaseSchema {
  protected tableName = 'lesson_progresses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('enrollment_id')
        .unsigned()
        .references('id')
        .inTable('enrollments')
        .onDelete('CASCADE')
        .nullable()

      table.timestamp('completed_at').nullable()

    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('enrollment_id')
      table.dropColumn('completed_at')
    })
  }
}