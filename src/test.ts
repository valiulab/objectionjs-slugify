import "reflect-metadata";
import { Model } from "objection";
import { Sluggable } from "./slug.decorator";

class A extends Model {
    firstname: string;

    lastname: string;

    @Sluggable(['firstname', 'lastname'])
    slug: string;
}

const obj = new A();
obj.firstname = "Rodrigo"
obj.lastname = "Alcorta"