import "reflect-metadata";
import { Sluggable } from "../src/decorator/slug.decorator";
import { Model } from 'objection';
import Knex from 'knex';
import mockKnex from 'mock-knex';

var db = Knex({
  client: 'sqlite',
  useNullAsDefault: true,
});
mockKnex.mock(db);
const tracker = mockKnex.getTracker();
Model.knex(db);

class PersonTestModel extends Model {
  static tableName = 'people'
  firstname: string;
  lastname: string;

  @Sluggable(['firstname', 'lastname'])
  slug?: string;
}

describe("[Slug] sluggable feature test", () => {
  beforeEach((done) => {
    tracker.install();
    done();
  });

  afterEach((done) => {
    tracker.uninstall();
    done();
  });

  it("should return true if slug is created from props with slug repited", async () => {
    tracker.on('query', function sendResult(query, step) {
      [
        function () {
          query.response([{ id: 1, slug: 'rodrigo-alcorta' }]);
        },
        function () {
          query.response([null]);
        },
        function () {
          query.response([null]);
        }
      ][step - 1]();
    });
    const obj = new PersonTestModel();
    obj.firstname = "Rodrigo"
    obj.lastname = "Alcorta"
    const objWithSlug = await PersonTestModel.query().insert(obj);
    expect(objWithSlug.slug).toMatch(/^rodrigo-alcorta-/);
  });

  it("should return true if slug is created from props with slug repited", async () => {
    tracker.on('query', function sendResult(query) {
      query.response(null);
    });
    const obj = new PersonTestModel();
    obj.firstname = "Rodrigo"
    obj.lastname = "Alcorta"
    const objWithSlug = await PersonTestModel.query().insert(obj);
    expect(objWithSlug.slug).toMatch('rodrigo-alcorta');
  });
});