import { Inject,Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Comment } from '../shared/comment';
import { visibility } from '../animations/app.animation';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ],
})
export class DishdetailComponent implements OnInit {
  dish:Dish;
  dishIds:number[];
  prev:number;
  next:number;
  comment:Comment;
  dishService:DishService;
  errMess:string;
  visibility:'shown';
  formErrors = {
    'author': '',
    'comment': '',
    'rating': ''
  };
  dishcopy = null;
  validationMessages = {
    'author': {
      'required':                          'Author Name is required',
      'minlength':                         'Author Name must be atleast 2 characters long'
    },
    'comment': {
      'required':                          'Comment is required'
    },
    'rating':{
      'required':                          'rating is required'
    }
  };
  commentForm : FormGroup;
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject ('BaseURL') private BaseURL,
    private fb: FormBuilder) {
      this.createForm();
    }
  ngOnInit() {
    this.createForm();
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    .switchMap((params: Params) => { this.visibility = 'shown';
    return this.dishservice.getDish(+params['id']); })
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish;
    this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => { this.dish = null; this.errMess = <any>errmess; });
  }

    goBack(): void {
      this.location.back();
    }
  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      comment: ['', Validators.required ],
      rating : ['',Validators.required]
  });
this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
this.onValueChanged();
}
onValueChanged(data?: any) {
  if (!this.commentForm) { return; }
  const form = this.commentForm;
  for (const field in this.formErrors) {
    // clear previous error message (if any)
    this.formErrors[field] = '';
    const control = form.get(field);
    if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        this.formErrors[field] += messages[key] +' ';
      }
    }
  }
}
onsubmit() {
  this.comment = this.commentForm.value;
  console.log(this.comment);
  this.commentForm.reset({
    author:'',
    comment:''
  });
  this.dishcopy.comments.push(this.comment);
  this.dishcopy.save()
  .subscribe(dish => { this.dish = dish; console.log(this.dish); });

 }
}
