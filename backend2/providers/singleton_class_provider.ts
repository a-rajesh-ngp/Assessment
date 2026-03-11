import type { ApplicationService } from '@adonisjs/core/types'
import CoursesRepository from '../app/repositories/instructor/courses_respository.js'
import AuthRepository from '../app/repositories/auth_repository.js'
import AssignmentsRepository from '../app/repositories/assignments_repository.js'

export default class SingletonClassProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(
      CoursesRepository, () => new CoursesRepository()
    )

    this.app.container.singleton(
      AuthRepository, () => new AuthRepository()
    )
    this.app.container.singleton(
      AssignmentsRepository, () => new AssignmentsRepository()
    )

  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}