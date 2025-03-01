import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TodoGroup } from '../../todo-groups/entities/todo-group.entity';
import { TodoItem } from '../../todo-items/entities/todo-item.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // (ClassSerializerInterceptor + @Exclude()) to exclude password from response
  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => TodoGroup, (todoGroup) => todoGroup.user)
  todoGroups: TodoGroup[];

  @OneToMany(() => TodoItem, (todoItem) => todoItem.user)
  todoItems: TodoItem[];
}
