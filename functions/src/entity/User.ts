import {
  Entity,
  Column,
  BaseEntity,
  //BeforeInsert,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  userID: string;

  @Column()
  email: string;

  @Column()
  createdAt: string;

  @Column()
  role: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  displayName: string;

  @Column()
  nameOfOrga: string;

  @Column()
  adressOfOrgaStreet: string;

  @Column()
  adressOfOrgaCity: string;

  @Column()
  adressOfOrgaPostalCode: number;
}
