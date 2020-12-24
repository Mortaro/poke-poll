import Nullstack from 'nullstack';
import Vote from './Vote';

// https://nullstack.app/styles
import './Poll.scss';

class Poll extends Nullstack {

  // https://nullstack.app/stateful-components
  pokemons = [];

  // https://nullstack.app/context-page
  prepare({project, page}) {
    page.title = `${project.name} built with Nullstack!`;
  }

  // https://nullstack.app/server-functions
  // https://nullstack.app/context
  static async getTopTenPokemons({database}) {
    return await database.collection('pokemons').find().sort({votes: -1}).limit(10).toArray();
  }

  // https://nullstack.app/full-stack-lifecycle
  async initiate() {
    this.pokemons = await this.getTopTenPokemons();
  }

  // https://nullstack.app/renderable-components
  renderPokemon({ranking, name, sprite, number, votes}) {
    return (
      <li>
        <div>
          <h3>#{ranking}</h3>
          <img src={sprite} width="96" height="96" />
          <span>#{number}</span>
          <a href={`/${name}`}>{name}</a>
          <small>{votes} votes</small>
        </div>
      </li>
    )
  }
  
  // https://nullstack.app/renderable-components
  render({page}) {
    return (
      <div>
        <h1> {page.title} </h1>
        <Vote />
        <ul>
          {this.pokemons.map((pokemon, index) => <Pokemon {...pokemon} ranking={index + 1} />)}
        </ul>
      </div>
    )
  }

}

export default Poll;