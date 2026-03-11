import { BaseSchema } from '@adonisjs/lucid/schema'
import { table } from 'console'

export default class extends BaseSchema {
  protected tableName = 'lesson_progresses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('enrollment_id').notNullable().alter()
      table.dropColumn('user_id')

      table.unique(['enrollment_id', 'lesson_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned()
      table.dropUnique(['enrollment_id', 'lesson_id'])
    })
  }
}