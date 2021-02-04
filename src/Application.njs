import Nullstack from 'nullstack';
import Poll from './Poll';
import About from './About';
import Pokemon from './Pokemon';
import Offline from './Offline';
import GoogleAnalytics from 'nullstack-google-analytics';
import {MongoClient} from 'mongodb';

// https://nullstack.app/styles
import './Application.scss';

class Application extends Nullstack {

  // https://nullstack.app/application-startup
  static async start(context) {
    await this.startServer(context);
    await this.startProject(context);
    await this.startDatabase(context);
    await this.startWorker(context);
    await About.start(context);
  }

  // https://nullstack.app/server-request-and-response
  static async startServer({server}) {
    server.port = process.env.PORT || 5001;
  }

  // https://nullstack.app/context-project
  static async startProject({project}) {
    project.name = 'Poke Poll';
    project.domain = 'nullstack.app';
    project.color = '#D22365';
  }

  // https://nullstack.app/how-to-use-mongodb-with-nullstack
  // https://nullstack.app/context-secrets
  static async startDatabase(context) {
    const {secrets} = context;
    secrets.development.databaseHost = 'mongodb://localhost:27017';
    secrets.databaseName = 'poke-poll';
    const databaseClient = new MongoClient(secrets.databaseHost);
    await databaseClient.connect();
    context.database = await databaseClient.db(secrets.databaseName);
  }

   // https://nullstack.app/service-worker
  static async startWorker({worker}) {
    worker.preload = [
      '/roboto-v20-latin-300.woff2',
      '/crete-round-v9-latin-regular.woff2'
    ]
  }

  // https://nullstack.app/context-page
  // https://nullstack.app/full-stack-lifecycle#prepare
  prepare({page}) {
    page.locale = 'en';
    page.description = 'This is an experiment using Nullstack for the front-end and back-end';
  }

  // https://nullstack.app/renderable-components#inner-components
  // https://nullstack.app/renderable-components#the-head-tag
  // https://nullstack.app/server-side-rendering
  renderPreloader() {
    return (
      <head>
        <link rel="preload" href="/roboto-v20-latin-300.woff2" as="font" type="font/woff2" crossorigin />
        <link rel="preload" href="/crete-round-v9-latin-regular.woff2" as="font" type="font/woff2" crossorigin />
      </head>
    )
  }

  // https://nullstack.app/routes-and-params
  // https://nullstack.app/renderable-components
  // https://nullstack.app/service-worker
  render({worker}) {
    return (
      <main data-loading={worker.fetching}>
        {worker.responsive ?
          <nav>
            <a href="/"> Take The Poll </a>
            <a href="/about"> What is this? </a>
          </nav> :
          <Offline route="*" />
        }
        <Poll route="/" />
        <About route="/about" />
        <Pokemon route="/:name" />
        <GoogleAnalytics id="G-GB6NSD560D" />
        <Preloader />
      </main>
    )
  }

}

export default Application;