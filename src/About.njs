import Nullstack from 'nullstack';

class About extends Nullstack {

  // https://nullstack.app/application-startup
  static async start(context) {
    const {readFileSync} = await import('fs');
    const {Remarkable} = await import('remarkable');
    const text = readFileSync('README.md', 'utf-8');
    const md = new Remarkable();
    md.use((md) => {
      const originalRender = md.renderer.rules.link_open;
      md.renderer.rules.link_open = function() {
        let result = originalRender.apply(null, arguments);
        const regexp = /href="([^"]*)"/;
        const href = regexp.exec(result)[1];
        if(!href.startsWith('/')) {
          result = result.replace('>', ' target="_blank" rel="noopener">');
        }
        return result;
      };
    });
    context.readme = md.render(text);
  }

  // https://nullstack.app/context-page
  // https://nullstack.app/full-stack-lifecycle
  prepare({project, page}) {
    page.title = `What is ${project.name}`;
  }

  // https://nullstack.app/context
  // https://nullstack.app/server-functions
  static async getReadme({readme}) {
    return readme;
  }

  // https://nullstack.app/context
  // https://nullstack.app/full-stack-lifecycle
  async initiate(context) {
    if(!context.readme) {
      context.readme = await this.getReadme();
    }
  }
  
  // https://nullstack.app/renderable-components
  render({readme}) {
    return (
      <article html={readme || ''} />
    )
  }

}

export default About;