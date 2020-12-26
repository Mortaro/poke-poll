import Nullstack from 'nullstack';

// https://nullstack.app/styles
import './Vote.scss';

class Vote extends Nullstack {

  // https://nullstack.app/stateful-components
  choice = '';
  message = '';

  // https://nullstack.app/server-functions
  // https://nullstack.app/context
  static async persistVote({database, choice}) {
    const slug = choice.replace(/[^\w\s]/gi, '').toLowerCase();
    const exists = await database.collection('pokemons').findOne({$or: [
      {name: slug},
      {number: parseInt(slug)}
    ]});
    if(!exists) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
      if(response.status == 404) {
        return {error: 'Pokemon not found'};
      }
      const data = await response.json();
      const pokemon = {
        name: data.name,
        sprite: data.sprites.front_default,
        number: data.id,
        votes: 1,
        types: data.types.map(({type}) => type.name)
      };
      await database.collection('pokemons').insertOne(pokemon);
      return {name: pokemon.name};
    } else {
      const {value: pokemon} = await database.collection('pokemons').findAndModify(
        {_id: exists._id},
        [],
        {$inc: {votes: 1}},
        {new: true}
      );
      return {name: pokemon.name};
    }
  }

  // https://nullstack.app/stateful-components
  // https://nullstack.app/context
  // https://nullstack.app/routes-and-params
  async submitVote({router}) {
    const {error, name} = await this.persistVote({choice: this.choice});
    if(error) {
      this.message = error;
    } else {
      router.url = `/${name}`;
    }
  }
  
  // https://nullstack.app/renderable-components
  // https://nullstack.app/two-way-bindings 
  // https://nullstack.app/service-worker
  render({worker}) {
    return (
      <form onsubmit={this.submitVote}> 
        <label for="choice"> Which is the best Pokemon? You can vote using a Pokemon name or number</label>
        <input bind={this.choice} id="choice" />
        <button disabled={worker.loading.persistVote}> Vote </button>
        {this.message && <p>{this.message}</p>}
      </form>
    )
  }

}

export default Vote;