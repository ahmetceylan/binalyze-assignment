import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TodoGroup } from '../todo-groups/todo-group.entity';
import { TodoItem } from '../todo-items/todo-item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TodoGroup, (todoGroup) => todoGroup.user)
  todoGroups: TodoGroup[];

  @OneToMany(() => TodoItem, (todoItem) => todoItem.user)
  todoItems: TodoItem[];
}
