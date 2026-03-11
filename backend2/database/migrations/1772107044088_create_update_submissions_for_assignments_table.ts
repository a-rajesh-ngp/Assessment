import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('enrollment_id')
        .unsigned()
        .references('id')
        .inTable('enrollments')
        .onDelete('CASCADE')
        .notNullable()

        table
          .enum('status', ['submitted', 'graded', 'resubmitted'])
          .notNullable()
    })

    
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('enrollment_id')
      table.dropColumn('status')
    })
  }
}