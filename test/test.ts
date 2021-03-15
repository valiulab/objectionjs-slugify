import "reflect-metadata";
import { Sluggable } from "../src/decorator/slug.decorator";
import { Model } from 'objection';
import Knex from 'knex';
import mockKnex from 'mock-knex';
var db = Knex({
    client: 'pg',
    useNullAsDefault: true,
});

mockKnex.mock(db);
// mockKnex.unmock(db);

const tracker = mockKnex.getTracker();

Model.knex(db);

class A extends Model {
    static tableName = 'testModelA'

    firstname: string;

    lastname: string;

    @Sluggable(['firstname', 'lastname'])
    slug?: string;
}

describe("test sluggable feature", () => {
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
          function firstQuery() {
            query.response([{id: 1, slug: 'rodrigo-alcorta'}]);
          },
          function secondQuery() {
            query.response({id: 2});
          }
        ][step - 1]();
    });
        
    const obj = new A();
    obj.firstname = "Rodrigo"
    obj.lastname = "Alcorta"
    const objWithSlug = await A.query().insert(obj);

    expect(objWithSlug.slug).toMatch(/^rodrigo-alcorta-/);
  });

  it("should return true if slug is created from props with slug repited", async () => {
    tracker.on('query', function sendResult(query) {
      query.response(null);
    });

    const obj = new A();
    obj.firstname = "Rodrigo"
    obj.lastname = "Alcorta"
    const objWithSlug = await A.query().insert(obj);

    expect(objWithSlug.slug).toMatch('rodrigo-alcorta');
  });
});